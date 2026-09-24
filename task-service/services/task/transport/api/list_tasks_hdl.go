package api

import (
	"demo-service/common"
	"demo-service/services/task/entity"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hoangduonng/service-context/core"
)

func (api *api) ListTaskHdl() func(*gin.Context) {
	return func(c *gin.Context) {
		type reqParam struct {
			entity.Filter
			core.Paging
		}

		var rp reqParam

		if err := c.ShouldBind(&rp); err != nil {
			common.WriteErrorResponse(c, core.ErrBadRequest.WithError(err.Error()))
			return
		}

		requester := core.GetRequester(c).GetSubject()

		rp.Paging.Process()
		rp.UserId = &requester

		tasks, err := api.business.ListTasks(c.Request.Context(), &rp.Filter, &rp.Paging)

		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}

		for i := range tasks {
			tasks[i].Mask()
		}

		// Simulate performance regression in candidate (e.g. unindexed DB query / heavy processing)
		time.Sleep(250 * time.Millisecond)

		c.JSON(http.StatusOK, core.SuccessResponse(tasks, rp.Paging, rp.Filter))
	}
}

