package api

import (
	"demo-service/common"
	"github.com/gin-gonic/gin"
	"github.com/hoangduonng/service-context/core"
	"net/http"
)

func (api *api) GetNoteHdl() func(*gin.Context) {
	return func(c *gin.Context) {
		requester := c.MustGet(core.KeyRequester).(core.Requester)
		ctx := core.ContextWithRequester(c.Request.Context(), requester)

		data, err := api.business.GetNote(ctx)
		if err != nil {
			common.WriteErrorResponse(c, err)
			return
		}

		data.Mask()

		c.JSON(http.StatusOK, core.ResponseData(data))
	}
}
