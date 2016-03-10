// name: create_constraint_user_email
CREATE CONSTRAINT ON (u:user) ASSERT u.email IS UNIQUE

// name: create_constraint_user_id
CREATE CONSTRAINT ON (u:user) ASSERT u.id IS UNIQUE