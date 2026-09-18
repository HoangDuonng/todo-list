-- Seed demo tasks for Cloud SQL backup/restore drills.
-- Applied once by golang-migrate at service boot (tracked in schema_migrations).
INSERT INTO `tasks` (`user_id`, `title`, `description`, `status`, `priority`, `created_at`) VALUES
(1, 'Fix loi thanh toan VNPay callback', 'Callback tra ve sai checksum khi amount co so le, kiem tra lai ham verify o auth-service', 'doing', 'urgent', '2026-09-16 09:00:00'),
(1, 'Viet API docs cho auth-service', 'Bo sung swagger cho cac endpoint /auth/login, /auth/refresh, /auth/verify', 'doing', 'medium', '2026-09-10 14:30:00'),
(2, 'Setup ArgoCD monitoring stack', 'Cai kube-prometheus-stack + loki + promtail qua app-of-apps, gan datasource san', 'done', 'low', '2026-09-05 10:00:00'),
(1, 'Migrate MySQL sang Cloud SQL', 'Tat mysql in-cluster, tro DSN sang private IP, verify migrate tu chay', 'done', 'urgent', '2026-09-17 08:00:00'),
(3, 'Code review PR task-service', 'Review PR them truong priority: check enum, index, tuong thich API cu', 'doing', 'medium', '2026-09-15 16:00:00'),
(2, 'Hotfix gateway timeout 504', 'Tyk gateway timeout khi task-service query cham, tang proxy timeout len 60s', 'doing', 'urgent', '2026-09-18 07:30:00'),
(3, 'Hoc backup/restore Cloud SQL (PITR)', 'Bam backup tay 1 phat, gia lap xoa nham 1 task roi restore point-in-time', 'doing', 'low', '2026-09-12 11:00:00'),
(2, 'Them index bang tasks', 'Danh index (user_id, status) cho query list task theo user nhanh hon', 'done', 'medium', '2026-09-08 09:15:00'),
(1, 'Don branch git cu', 'Xoa cac branch feature da merge tren ca 3 repo: todo, infra, gitops', 'done', 'low', '2026-09-03 17:00:00'),
(3, 'Oncall: Redis OOM tren infra node', 'Redis dung 96Mi bi OOM khi traffic spike, xem lai limit va eviction policy', 'doing', 'urgent', '2026-09-18 06:45:00'),
(2, 'Benchmark k6 cho endpoint /tasks', 'Viet script k6 100 VUs trong 5 phut, doc p95 tren Grafana', 'doing', 'medium', '2026-09-14 13:00:00'),
(1, 'Cau hinh imagePullSecret GAR', 'Tao SA gar-puller least-privilege, nap secret, patch default serviceaccount', 'done', 'medium', '2026-09-17 15:00:00'),
(3, 'Thu nghiem FE dark mode (huy)', 'Thu dark mode bang tailwind class strategy, conflict voi theme cu nen huy', 'deleted', 'low', '2026-09-06 20:00:00'),
(2, 'Rotate PAT GitHub', 'PAT cu dung cho argocd repo secret, rotate dinh ky 90 ngay', 'done', 'urgent', '2026-09-11 08:30:00'),
(3, 'Viet runbook restore Cloud SQL', 'Ghi cac buoc clone/restore instance + doi DSN khi drill that bai', 'doing', 'medium', '2026-09-13 10:45:00');
