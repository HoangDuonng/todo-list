package entity

import (
	"demo-service/common"
	"github.com/hoangduonng/service-context/core"
)

type Note struct {
	core.SQLModel
	UserId  int    `json:"-" gorm:"column:user_id" db:"user_id"`
	Content string `json:"content" gorm:"column:content;" db:"content"`
}

func (Note) TableName() string { return "notes" }

func (n *Note) Mask() {
	n.SQLModel.Mask(common.MaskTypeNote)
}

type NoteUpdate struct {
	Content string `json:"content" gorm:"column:content;" db:"content"`
}

func (NoteUpdate) TableName() string { return Note{}.TableName() }
