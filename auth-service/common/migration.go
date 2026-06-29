package common

import (
	"errors"
	"log"
	"os"
	"strings"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func RunDBMigration(migrationPath string) {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		log.Println("DB_DSN environment variable is empty, skipping database migrations")
		return
	}

	migrateDSN := dsn
	if !strings.HasPrefix(migrateDSN, "mysql://") {
		migrateDSN = "mysql://" + migrateDSN
	}

	if !strings.Contains(migrateDSN, "multiStatements=true") {
		if strings.Contains(migrateDSN, "?") {
			migrateDSN = migrateDSN + "&multiStatements=true"
		} else {
			migrateDSN = migrateDSN + "?multiStatements=true"
		}
	}

	log.Printf("Running database migrations from %s...\n", migrationPath)
	m, err := migrate.New("file://"+migrationPath, migrateDSN)
	if err != nil {
		log.Fatalf("Could not create migrate instance: %v\n", err)
	}

	if err := m.Up(); err != nil {
		if errors.Is(err, migrate.ErrNoChange) {
			log.Println("Database is already up to date.")
		} else {
			log.Fatalf("Could not run up migrations: %v\n", err)
		}
	} else {
		log.Println("Database migrations applied successfully!")
	}
}
