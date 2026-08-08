package cmd

import (
	"context"
	"demo-service/common"
	"demo-service/composer"
	"demo-service/middleware"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	sctx "github.com/hoangduonng/service-context"
	"github.com/hoangduonng/service-context/component/ginc"
	smdlw "github.com/hoangduonng/service-context/component/ginc/middleware"
	"github.com/hoangduonng/service-context/component/gormc"
	"github.com/hoangduonng/service-context/component/jwtc"
	"github.com/spf13/cobra"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
)

func newServiceCtx() sctx.ServiceContext {
	return sctx.NewServiceContext(
		sctx.WithName("Demo Microservices"),
		sctx.WithComponent(ginc.NewGin(common.KeyCompGIN)),
		sctx.WithComponent(gormc.NewGormDB(common.KeyCompMySQL, "")),
		sctx.WithComponent(jwtc.NewJWT(common.KeyCompJWT)),
		sctx.WithComponent(NewConfig()),
	)
}

var rootCmd = &cobra.Command{
	Use:   "app",
	Short: "Start service",
	Run: func(cmd *cobra.Command, args []string) {
		// Make some delay for DB ready (migration)
		// remove it if you already had your own DB
		time.Sleep(time.Second * 5)

		common.RunDBMigration("migrations")

		serviceName := os.Getenv("OTEL_SERVICE_NAME")
		if serviceName == "" {
			serviceName = "task-service"
		}
		shutdown, err := common.InitTracer(serviceName)
		if err == nil && shutdown != nil {
			defer shutdown(context.Background())
		}

		serviceCtx := newServiceCtx()

		logger := sctx.GlobalLogger().GetLogger("service")

		if err := serviceCtx.Load(); err != nil {
			logger.Fatal(err)
		}

		ginComp := serviceCtx.MustGet(common.KeyCompGIN).(common.GINComponent)

		router := ginComp.GetRouter()
		router.Use(otelgin.Middleware(serviceName))
		router.Use(gin.Recovery(), gin.LoggerWithConfig(gin.LoggerConfig{SkipPaths: []string{"/ping"}}), smdlw.Recovery(serviceCtx))

		router.Use(middleware.Cors())
		router.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"data": "pong"})
		})

		v1 := router.Group("/v1")

		SetupRoutes(v1, serviceCtx)

		if err := router.Run(fmt.Sprintf(":%d", ginComp.GetPort())); err != nil {
			logger.Fatal(err)
		}
	},
}

func SetupRoutes(router *gin.RouterGroup, serviceCtx sctx.ServiceContext) {

	taskAPIService := composer.ComposeTaskAPIService(serviceCtx)

	requireAuthMdw := middleware.RequireAuth(composer.ComposeAuthRPCClient(serviceCtx))

	tasks := router.Group("/tasks", requireAuthMdw)
	{
		tasks.GET("", taskAPIService.ListTaskHdl())
		tasks.POST("", taskAPIService.CreateTaskHdl())
		tasks.GET("/:task-id", taskAPIService.GetTaskHdl())
		tasks.PATCH("/:task-id", taskAPIService.UpdateTaskHdl())
		tasks.PATCH("/:task-id/done", taskAPIService.DoneTaskHdl())
		tasks.PATCH("/:task-id/doing", taskAPIService.DoingTaskHdl())
		tasks.DELETE("/:task-id", taskAPIService.DeleteTaskHdl())
	}

	noteAPIService := composer.ComposeNoteAPIService(serviceCtx)
	notes := router.Group("/notes", requireAuthMdw)
	{
		notes.GET("", noteAPIService.GetNoteHdl())
		notes.PUT("", noteAPIService.UpsertNoteHdl())
	}
}

func Execute() {
	rootCmd.AddCommand(outEnvCmd)

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
