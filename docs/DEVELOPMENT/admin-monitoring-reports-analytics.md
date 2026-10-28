# Admin monitoring, reports, and analytics

The admin dashboard and Reports screen use the authenticated backend endpoint `GET /api/v1/admin/insights`. It aggregates active learner accounts and their saved PostgreSQL progress, quiz and content status, quiz score summaries, and the 100 most recent backend admin actions. The endpoint excludes anonymous test-only quiz attempts.

`active30Days` means progress was saved in the last 30 days. `savedQuizAttempts` sums cumulative attempt counters in saved quiz score records. `averageLatestScore` averages each learner's latest saved percentage for each quiz and is unavailable when there are no scores. Accounts without synced progress contribute to the learner count but have no saved activity. Content coverage counts administrator-created backend items. Firestore/local topic drafts appear in separate, labeled columns or cards and are unavailable when that source cannot be loaded.

`GET /api/v1/admin/monitoring` reports `healthy` only when its database probe and quiz statistics query both succeed. The admin analytics screen refreshes monitoring every 60 seconds and displays degraded or unavailable states without placeholder metrics.

Reports provide learner progress, quiz performance, content coverage, and publishing activity views. They support grade filters and pagination. Web users can download CSV; mobile users can share CSV text. The report table and export are derived from the same loaded snapshot.
