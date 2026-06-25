package api

import (
	"context"
	"demo-service/services/note/entity"
	sctx "github.com/hoangduonng/service-context"
)

type Business interface {
	GetNote(ctx context.Context) (*entity.Note, error)
	UpsertNote(ctx context.Context, content string) error
}

type api struct {
	serviceCtx sctx.ServiceContext
	business   Business
}

func NewAPI(serviceCtx sctx.ServiceContext, business Business) *api {
	return &api{
		serviceCtx: serviceCtx,
		business:   business,
	}
}
