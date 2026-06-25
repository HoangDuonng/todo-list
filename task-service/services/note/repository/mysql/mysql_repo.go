package mysql

import (
	"context"
	"demo-service/services/note/entity"
	"errors"
	"gorm.io/gorm"
)

type mysqlRepo struct {
	db *gorm.DB
}

func NewMySQLRepository(db *gorm.DB) *mysqlRepo {
	return &mysqlRepo{db: db}
}

func (repo *mysqlRepo) GetNoteByUserId(ctx context.Context, userId int) (*entity.Note, error) {
	var data entity.Note
	if err := repo.db.WithContext(ctx).Where("user_id = ?", userId).First(&data).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Return a new note struct if it doesn't exist in DB yet
			return &entity.Note{
				UserId:  userId,
				Content: "",
			}, nil
		}
		return nil, err
	}
	return &data, nil
}

func (repo *mysqlRepo) UpsertNote(ctx context.Context, userId int, content string) error {
	var data entity.Note
	err := repo.db.WithContext(ctx).Where("user_id = ?", userId).First(&data).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newNote := entity.Note{
				UserId:  userId,
				Content: content,
			}
			return repo.db.WithContext(ctx).Create(&newNote).Error
		}
		return err
	}
	data.Content = content
	return repo.db.WithContext(ctx).Save(&data).Error
}
