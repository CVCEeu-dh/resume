// name: create_constraint_user_email
CREATE CONSTRAINT ON (u:user) ASSERT u.email IS UNIQUE

// name: create_constraint_user_uid
CREATE CONSTRAINT ON (u:user) ASSERT u.uid IS UNIQUE

// name: create_constraint_story_uid
CREATE CONSTRAINT ON (s:story) ASSERT s.uid IS UNIQUE

// name: create_index_story_status
CREATE INDEX ON :story(status)