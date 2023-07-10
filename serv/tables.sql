DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'game_status'
  ) THEN
    CREATE TYPE game_status AS ENUM ('search opponent', 'running', 'finished');
    RAISE NOTICE 'Type created successfully';
  ELSE
    RAISE NOTICE 'Type already exists';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS battles (
  id SERIAL PRIMARY KEY,
  player1_name VARCHAR(100) NOT NULL,
  is_player1_online BOOLEAN NOT NULL,
  player2_name VARCHAR(100) NOT NULL,
  is_player2_online BOOLEAN NOT NULL,
  game_status game_status NOT NULL,
  game_data JSONB NOT NULL DEFAULT '[
      {"symbol": null, "acrossed": false},
      {"symbol": null, "acrossed": false},
      {"symbol": null, "acrossed": false},
      {"symbol": null, "acrossed": false},
      {"symbol": null, "acrossed": false},
      {"symbol": null, "acrossed": false},
      {"symbol": null, "acrossed": false},
      {"symbol": null, "acrossed": false},
      {"symbol": null, "acrossed": false}
    ]'
);