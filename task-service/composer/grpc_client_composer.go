package composer

import (
	"context"
	"demo-service/common"
	"demo-service/proto/pb"
	sctx "github.com/hoangduonng/service-context"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
)

type authClient struct {
	grpcAuthClient pb.AuthServiceClient
}

func (ac *authClient) IntrospectToken(ctx context.Context, accessToken string) (sub string, tid string, err error) {
	resp, err := ac.grpcAuthClient.IntrospectToken(ctx, &pb.IntrospectReq{AccessToken: accessToken})

	if err != nil {
		return "", "", err
	}

	return resp.Sub, resp.Tid, nil
}

// ComposeAuthRPCClient use only for middleware: get token info
func ComposeAuthRPCClient(serviceCtx sctx.ServiceContext) *authClient {
	configComp := serviceCtx.MustGet(common.KeyCompConf).(common.Config)

	opts := []grpc.DialOption{
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithStatsHandler(otelgrpc.NewClientHandler()),
	}
	clientConn, err := grpc.Dial(configComp.GetGRPCAuthServerAddress(), opts...)

	if err != nil {
		log.Fatal(err)
	}

	return &authClient{pb.NewAuthServiceClient(clientConn)}
}

func composeUserRPCClient(serviceCtx sctx.ServiceContext) pb.UserServiceClient {
	configComp := serviceCtx.MustGet(common.KeyCompConf).(common.Config)

	opts := []grpc.DialOption{
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithStatsHandler(otelgrpc.NewClientHandler()),
	}
	clientConn, err := grpc.Dial(configComp.GetGRPCUserServiceAddress(), opts...)

	if err != nil {
		log.Fatal(err)
	}

	return pb.NewUserServiceClient(clientConn)
}
