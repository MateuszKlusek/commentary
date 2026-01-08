WIP

# Nomenclature

- a discussion - a collections of comments under a single topic. An instance of Commentary shows comments for a single discussion `discusionId`
- a comment - a comment in a discussion. `commentId`. Is can be a top-level comment or a reply.
- a parent - a comment that has replied - a reply needs to have a `parentId`
- a thread - it's a top-level comment with all possible nested replies. It maps to a `commentary-thread` DOM element.
