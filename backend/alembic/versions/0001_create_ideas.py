
from alembic import op
import sqlalchemy as sa

revision = '0001_create_ideas'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'ideas',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('title', sa.String, nullable=False),
        sa.Column('description', sa.String),
        sa.Column('tags', sa.String),
        sa.Column('custom_fields', sa.JSON, server_default='{}'),
        sa.Column('archived', sa.Boolean, server_default='false'),
        sa.Column('position', sa.Integer, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

def downgrade():
    op.drop_table('ideas')
