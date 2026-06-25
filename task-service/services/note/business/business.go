package business

import (
	"context"
	"demo-service/services/note/entity"
	"github.com/hoangduonng/service-context/core"
)

type NoteRepository interface {
	GetNoteByUserId(ctx context.Context, userId int) (*entity.Note, error)
	UpsertNote(ctx context.Context, userId int, content string) error
}

type business struct {
	noteRepo NoteRepository
}

func NewBusiness(noteRepo NoteRepository) *business {
	return &business{
		noteRepo: noteRepo,
	}
}

func (biz *business) GetNote(ctx context.Context) (*entity.Note, error) {
	requester := core.GetRequester(ctx)
	uid, _ := core.FromBase58(requester.GetSubject())
	userId := int(uid.GetLocalID())

	note, err := biz.noteRepo.GetNoteByUserId(ctx, userId)
	if err != nil {
		return nil, core.ErrInternalServerError.WithError(err.Error())
	}
	return note, nil
}

func (biz *business) UpsertNote(ctx context.Context, content string) error {
	requester := core.GetRequester(ctx)
	uid, _ := core.FromBase58(requester.GetSubject())
	userId := int(uid.GetLocalID())

	if err := biz.noteRepo.UpsertNote(ctx, userId, content); err != nil {
		return core.ErrInternalServerError.WithError(err.Error())
	}
	return nil
}
