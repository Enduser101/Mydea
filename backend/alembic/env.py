from logging.config import fileConfig
import os
from sqlalchemy import engine_from_config, pool
from alembic import context
config = context.config
fileConfig(config.config_file_name)
db_url = os.getenv('DATABASE_URL', 'postgresql://mydea:mydea@db:5432/mydea')
config.set_main_option('sqlalchemy.url', db_url)
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from models import Base
target_metadata = Base.metadata
def run_migrations_offline():
    url = config.get_main_option('sqlalchemy.url')
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()
def run_migrations_online():
    connectable = engine_from_config(config.get_section(config.config_ini_section), prefix='sqlalchemy.', poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
