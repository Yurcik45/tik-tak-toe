DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'game_status') THEN
    CREATE TYPE game_status AS ENUM ('search opponent', 'running', 'finished');
    RAISE NOTICE 'Type game_status created successfully';
  ELSE
    RAISE NOTICE 'Type game_status already exists';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'symbol') THEN
    CREATE TYPE symbol AS ENUM ('x', 'o');
    RAISE NOTICE 'Type symbol created successfully';
  ELSE
    RAISE NOTICE 'Type symbol already exists';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS battles (
  id SERIAL PRIMARY KEY,
  -- player 1
  player1_name VARCHAR(100) NOT NULL,
  player1_symbol symbol NOT NULL,
  -- player 2
  player2_name VARCHAR(100),
  player2_symbol symbol NOT NULL,
  -- general
  last_step_player VARCHAR(100),
  game_status game_status NOT NULL,
  game_data JSONB NOT NULL DEFAULT '[
      {"id": 0,"symbol": null, "acrossed": false},
      {"id": 1,"symbol": null, "acrossed": false},
      {"id": 2,"symbol": null, "acrossed": false},
      {"id": 3,"symbol": null, "acrossed": false},
      {"id": 4,"symbol": null, "acrossed": false},
      {"id": 5,"symbol": null, "acrossed": false},
      {"id": 6,"symbol": null, "acrossed": false},
      {"id": 7,"symbol": null, "acrossed": false},
      {"id": 8,"symbol": null, "acrossed": false}
    ]'
);