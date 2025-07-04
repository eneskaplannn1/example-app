# Plant Care Companion - Database Documentation

## Overview

This document describes the SQL tables used in the Plant Care Companion app, a mobile application built with Expo, React Native, and Supabase for plant care management.

## Database Tables

### 1. plants

Stores the plant care database with basic information about different plant species.

```sql
create table plants (
  id uuid default gen_random_uuid() primary key,
  common_name text,
  scientific_name text,
  watering text,
  sunlight text,
  soil text,
  description text
);
```

**Columns:**

- `id` - Unique identifier for each plant
- `common_name` - Common name of the plant (e.g., "Snake Plant")
- `scientific_name` - Scientific name of the plant (e.g., "Sansevieria trifasciata")
- `watering` - Watering requirements (e.g., "Water when soil is dry")
- `sunlight` - Sunlight requirements (e.g., "Bright indirect light")
- `soil` - Soil type requirements (e.g., "Well-draining potting mix")
- `description` - General description of the plant

**Usage:** This table serves as the master database of plants that users can browse and add to their collection.

---

### 2. users

Stores user account information.

```sql
create table users (
  id uuid default gen_random_uuid() primary key,
  email text,
  name text
);
```

**Columns:**

- `id` - Unique identifier for each user
- `email` - User's email address
- `name` - User's display name

**Usage:** User authentication and profile management.

---

### 3. user_plants

Tracks which plants each user owns and their personal notes.

```sql
create table user_plants (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  plant_id uuid,
  nickname text,
  acquired_date date,
  last_watered date,
  notes text
);
```

**Columns:**

- `id` - Unique identifier for each user plant entry
- `user_id` - References the user who owns this plant
- `plant_id` - References the plant from the plants table
- `nickname` - User's custom name for this plant (optional)
- `acquired_date` - Date when the user acquired the plant
- `last_watered` - Date when the plant was last watered
- `notes` - User's personal notes about this plant

**Usage:** Personal plant collection management, tracking care history.

---

### 4. care_reminders

Stores care reminders for user plants.

```sql
create table care_reminders (
  id uuid default gen_random_uuid() primary key,
  user_plant_id uuid,
  reminder_type text,
  reminder_time timestamptz,
  message text
);
```

**Columns:**

- `id` - Unique identifier for each reminder
- `user_plant_id` - References the specific user plant
- `reminder_type` - Type of care reminder (e.g., "water", "fertilize", "repot")
- `reminder_time` - When the reminder should trigger
- `message` - Custom message for the reminder

**Usage:** Care scheduling and notification system.

---

### 5. weather_alerts

Stores weather-related alerts for users.

```sql
create table weather_alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  alert_type text,
  alert_time timestamptz,
  message text
);
```

**Columns:**

- `id` - Unique identifier for each weather alert
- `user_id` - References the user who should receive the alert
- `alert_type` - Type of weather alert (e.g., "frost", "heat", "drought")
- `alert_time` - When the alert was created/triggered
- `message` - Description of the weather alert

**Usage:** Weather-based plant care notifications.

---

### 6. plant_identification_guides

Stores identification information and images for plants.

```sql
create table plant_identification_guides (
  id uuid default gen_random_uuid() primary key,
  plant_id uuid,
  guide_text text,
  image_url text
);
```

**Columns:**

- `id` - Unique identifier for each identification guide
- `plant_id` - References the plant this guide belongs to
- `guide_text` - Text description for plant identification
- `image_url` - URL to an image showing the plant

**Usage:** Plant identification and educational content.

---

## Relationships

### Primary Relationships:

- `user_plants.user_id` → `users.id`
- `user_plants.plant_id` → `plants.id`
- `care_reminders.user_plant_id` → `user_plants.id`
- `weather_alerts.user_id` → `users.id`
- `plant_identification_guides.plant_id` → `plants.id`

### Data Flow:

1. Users browse the `plants` table to find plants they want to add
2. Users add plants to their collection via `user_plants` table
3. Care reminders are created based on `user_plants` entries
4. Weather alerts are generated based on user location and plant needs
5. Identification guides help users learn about their plants

---

## Sample Data

### Example Plant Entry:

```sql
INSERT INTO plants (common_name, scientific_name, watering, sunlight, soil, description)
VALUES (
  'Snake Plant',
  'Sansevieria trifasciata',
  'Water when soil is completely dry',
  'Low to bright indirect light',
  'Well-draining potting mix',
  'A hardy, low-maintenance plant perfect for beginners. Known for its air-purifying qualities.'
);
```

### Example User Plant Entry:

```sql
INSERT INTO user_plants (user_id, plant_id, nickname, acquired_date, last_watered, notes)
VALUES (
  'user-uuid-here',
  'plant-uuid-here',
  'Snakey',
  '2024-01-15',
  '2024-01-20',
  'Placed in living room corner. Growing well!'
);
```

---

## Notes

- **No Indexes or Constraints:** As per requirements, no indexes or foreign key constraints were added to the tables
- **UUID Primary Keys:** All tables use UUID primary keys for better scalability and security
- **Flexible Schema:** The schema is designed to be flexible and accommodate future features
- **Supabase Integration:** These tables are designed to work with Supabase's real-time features and Row Level Security (RLS)

---

## Future Enhancements

Potential additions to consider:

- Plant care history tracking
- Photo uploads for user plants
- Community features (plant sharing, tips)
- Advanced weather integration
- Plant health monitoring
- Care schedule templates
