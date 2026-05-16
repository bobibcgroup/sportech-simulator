create table if not exists model_params (
  key         text primary key,
  value       numeric not null,
  label       text not null,
  description text not null,
  category    text not null,
  updated_at  timestamptz default now()
);

alter table model_params enable row level security;

create policy "service role full access model_params"
  on model_params for all using (true);

insert into model_params (key, value, label, description, category) values
  -- Tier Distribution (% of paid users per tier)
  ('tier_star_pct',       0.750,   'Star tier %',                    '% of paid users classified as Stars',                              'Tier Distribution'),
  ('tier_superstar_pct',  0.225,   'SuperStar tier %',               '% of paid users classified as SuperStars (remainder = Partners)',   'Tier Distribution'),

  -- Annual Subscriptions
  ('sub_star',            27.00,   'Star sub (USD/yr)',               'Annual subscription price for a Star tier user',                   'Annual Subscriptions'),
  ('sub_superstar',       13.23,   'SuperStar sub (USD/yr)',          'Annual subscription price for a SuperStar tier user',              'Annual Subscriptions'),
  ('sub_partner',         53.73,   'Partner sub (USD/yr)',            'Annual subscription price for a Partner tier user',                'Annual Subscriptions'),

  -- Predictions
  ('pred_fan',            2.70,    'Fan predictions (USD/mo)',        'Avg monthly prediction spend — Free Fan',                          'Predictions'),
  ('pred_star',           27.00,   'Star predictions (USD/mo)',       'Avg monthly prediction spend — Star',                             'Predictions'),
  ('pred_superstar',      40.50,   'SuperStar predictions (USD/mo)', 'Avg monthly prediction spend — SuperStar',                        'Predictions'),
  ('pred_partner',        81.00,   'Partner predictions (USD/mo)',    'Avg monthly prediction spend — Partner',                          'Predictions'),

  -- Virtual Gifts
  ('gift_fan',            2.70,    'Fan gifts (USD/mo/game)',         'Avg monthly virtual gift spend per game — Free Fan',              'Virtual Gifts'),
  ('gift_star',           5.40,    'Star gifts (USD/mo/game)',        'Avg monthly virtual gift spend per game — Star',                  'Virtual Gifts'),
  ('gift_superstar',      13.50,   'SuperStar gifts (USD/mo/game)',   'Avg monthly virtual gift spend per game — SuperStar',             'Virtual Gifts'),
  ('gift_partner',        27.00,   'Partner gifts (USD/mo/game)',     'Avg monthly virtual gift spend per game — Partner',               'Virtual Gifts'),

  -- Merchandise
  ('merch_fan',           13.50,   'Fan merch (USD/mo)',              'Avg monthly merchandise spend — Free Fan',                        'Merchandise'),
  ('merch_star',          54.00,   'Star merch (USD/mo)',             'Avg monthly merchandise spend — Star',                            'Merchandise'),
  ('merch_superstar',    108.00,   'SuperStar merch (USD/mo)',        'Avg monthly merchandise spend — SuperStar',                       'Merchandise'),
  ('merch_partner',      162.00,   'Partner merch (USD/mo)',          'Avg monthly merchandise spend — Partner',                         'Merchandise'),

  -- Token Economy
  ('tokens_fan',         100.44,   'Fan tokens (USD/mo)',             'Avg monthly token economy spend — Free Fan',                      'Token Economy'),
  ('tokens_star',        200.88,   'Star tokens (USD/mo)',            'Avg monthly token economy spend — Star',                          'Token Economy'),
  ('tokens_superstar',   401.76,   'SuperStar tokens (USD/mo)',       'Avg monthly token economy spend — SuperStar',                     'Token Economy'),
  ('tokens_partner',     502.20,   'Partner tokens (USD/mo)',         'Avg monthly token economy spend — Partner',                       'Token Economy'),

  -- Platform Rates
  ('token_fee_rate',      0.0078,  'Token fee rate',                  'Transaction fee on all token activity (default 0.78%)',           'Platform Rates'),
  ('merch_margin',        0.48,    'Merchandise margin',              'Platform margin on merchandise sales (default 48%)',              'Platform Rates'),
  ('participation_rate',  0.50,    'Participation rate',              'Share of users engaging with each revenue stream (default 50%)',  'Platform Rates'),
  ('gift_games_rate',     0.60,    'Gift games rate',                 'Share of games that have virtual gift activity (default 60%)',    'Platform Rates'),
  ('club_revenue_share',  0.50,    'Club revenue share',              'Club''s share of gross platform revenue (default 50%)',           'Platform Rates'),
  ('earnings_multiple',  14.00,    'Valuation multiple',              'Earnings multiple applied to Year 5 revenue for valuation',      'Platform Rates'),

  -- Spend Multipliers
  ('spend_low',           0.50,    'Low market multiplier',           'Revenue scaling factor for low fan-spend markets',                'Spend Multipliers'),
  ('spend_standard',      1.00,    'Standard market multiplier',      'Revenue scaling factor for standard fan-spend markets',           'Spend Multipliers'),
  ('spend_high',          1.75,    'High market multiplier',          'Revenue scaling factor for high fan-spend markets',               'Spend Multipliers'),

  -- Growth Projections (year-over-year multipliers)
  ('growth_yr2',          1.15,    'Year 2 growth rate',              'Revenue multiplier applied to Year 1 to get Year 2 (1.15 = +15%)', 'Growth Projections'),
  ('growth_yr3',          1.18,    'Year 3 growth rate',              'Revenue multiplier applied to Year 2 to get Year 3 (1.18 = +18%)', 'Growth Projections'),
  ('growth_yr4',          1.20,    'Year 4 growth rate',              'Revenue multiplier applied to Year 3 to get Year 4 (1.20 = +20%)', 'Growth Projections'),
  ('growth_yr5',          1.25,    'Year 5 growth rate',              'Revenue multiplier applied to Year 4 to get Year 5 (1.25 = +25%)', 'Growth Projections')

on conflict (key) do nothing;
