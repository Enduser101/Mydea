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
        sa.Column('title', sa.String(300), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('tags', sa.JSON),
        sa.Column('custom_fields', sa.JSON),
        sa.Column('archived', sa.Boolean, server_default='false'),
        sa.Column('position', sa.Integer),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now())
    )

def downgrade():
    op.drop_table('ideas')
