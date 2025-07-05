# Plant Care Notification Server

This server handles push notifications for the Plant Care app using a cron job approach.

## 🚀 Features

- **Server-side notifications** - Reliable delivery even when app is closed
- **Automatic scheduling** - Processes due reminders every 5 minutes
- **Expo push notifications** - Uses Expo's push service
- **Database integration** - Works with Supabase
- **Error handling** - Robust error handling and logging
- **Cleanup** - Automatic cleanup of old sent reminders

## 📋 Prerequisites

- Node.js 18+
- Supabase project with service role key
- Expo project configured for push notifications

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file:

```bash
cp .env.example .env
```

Fill in your configuration:

```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
LOG_LEVEL=info
```

### 3. Database Setup

Run the SQL migration in your Supabase dashboard:

```sql
-- Add expo_push_token column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS expo_push_token TEXT;

-- Add sent column to care_reminders table
ALTER TABLE care_reminders
ADD COLUMN IF NOT EXISTS sent TIMESTAMP WITH TIME ZONE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_care_reminders_due
ON care_reminders (reminder_time)
WHERE sent IS NULL;

CREATE INDEX IF NOT EXISTS idx_users_expo_token
ON users (expo_push_token)
WHERE expo_push_token IS NOT NULL;
```

### 4. Build and Test

```bash
# Build the project
npm run build

# Test the cron job
npm start
```

## 🚀 Deployment Options

### Option 1: GitHub Actions (Recommended)

1. Add secrets to your GitHub repository:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. The workflow will automatically run every 5 minutes

### Option 2: Traditional Cron Job

```bash
# Add to crontab
*/5 * * * * cd /path/to/server && node dist/cronJob.js
```

### Option 3: Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY .env ./

CMD ["node", "dist/cronJob.js"]
```

### Option 4: Cloud Services

- **AWS Lambda** with EventBridge
- **Google Cloud Functions** with Cloud Scheduler
- **Vercel Cron Jobs**
- **Railway** with cron triggers

## 📊 Monitoring

### Logs

The cron job logs:

- Number of due reminders found
- Success/failure of each notification
- Errors and exceptions
- Cleanup operations

### Metrics to Monitor

- Number of notifications sent per run
- Success rate of notifications
- Database query performance
- Expo API response times

## 🔧 Development

### Local Development

```bash
# Run in development mode with auto-restart
npm run dev

# Run once
npm start
```

### Testing

```bash
# Run tests
npm test
```

## 🐛 Troubleshooting

### Common Issues

1. **Notifications not sending**
   - Check Expo push tokens are valid
   - Verify Supabase connection
   - Check environment variables

2. **Database errors**
   - Verify service role key has proper permissions
   - Check database schema is up to date

3. **Performance issues**
   - Monitor database indexes
   - Check for large numbers of due reminders

### Debug Mode

Set `LOG_LEVEL=debug` in your `.env` file for detailed logging.

## 📈 Scaling

For high-volume applications:

1. **Batch processing** - Process reminders in batches
2. **Rate limiting** - Respect Expo API limits
3. **Database optimization** - Add more indexes as needed
4. **Caching** - Cache user tokens and plant data

## 🔒 Security

- Use service role key only for server operations
- Never expose service role key in client code
- Implement proper error handling
- Log security-relevant events

## 📝 License

MIT License - see LICENSE file for details
