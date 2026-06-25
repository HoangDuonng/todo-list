package api

import (
	"demo-service/common"
	"demo-service/services/note/entity"
	"github.com/gin-gonic/gin"
	"github.com/hoangduonng/service-context/core"
	"net/http"
)

func (api *api) UpsertNoteHdl() func(*gin.Context) {
	return func(c *gin.Context) {
		var data entity.NoteUpdate

		if err := c.ShouldBind(&data); err != nil {
			common.WriteErrorResponse(c, core.ErrBadRequest.WithError(err.Error()))
			return
		}

		requester := c.MustGet(core.KeyRequester).(core.Requester)
		ctx := core.ContextWithRequester(c.Request.Context(), requester)

		if err := api.business.UpsertNote(ctx, data.Content); err != nil {
			common.WriteErrorResponse(c, err)
			return
		}

		c.JSON(http.StatusOK, core.ResponseData(true))
	}
}
