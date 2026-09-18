-- Second seed batch so the demo account sees 15 tasks (backup drill set).
INSERT INTO `tasks` (`user_id`, `title`, `description`, `status`, `priority`, `created_at`) VALUES
(1, 'Fix FE goi gateway /tasks bi 404', 'Gateway strip /tasks/ con /, trong khi route task nam duoi /v1, can rule rewrite', 'doing', 'urgent', '2026-09-18 10:00:00'),
(1, 'Them limit query param cho API list', 'FE dang lay limit=50 cung, cho user chon 10/20/50 o dropdown', 'doing', 'medium', '2026-09-18 10:15:00'),
(1, 'Don user test drill@test.com', 'User tao ra luc verify seed bang API, xoa truoc khi drill backup', 'done', 'low', '2026-09-18 10:30:00'),
(1, 'Chuan bi drill restore PITR toi nay', 'Chup backup tay, note thoi diem, xoa 1 task, restore ve dung phut do', 'doing', 'urgent', '2026-09-18 11:00:00'),
(1, 'Verify seed du task tren Cloud SQL', 'Dem qua API port-forward, doi chieu status/priority voi file seed', 'done', 'medium', '2026-09-18 11:15:00'),
(1, 'Update README runbook backup', 'Ghi lai cac buoc backup/clone/restore Cloud SQL vao runbook team', 'doing', 'low', '2026-09-18 11:30:00'),
(1, 'Xac nhan ArgoCD sync root-app', 'Check 5 app con Synced/Healthy sau khi them monitoring stack', 'done', 'urgent', '2026-09-18 11:45:00'),
(1, 'Hoc NetworkPolicy egress cho Cloud SQL', 'Hien tai egress mo full, lab thu siết chi cho phep 10.21.0.3:3306', 'doing', 'medium', '2026-09-18 12:00:00');
