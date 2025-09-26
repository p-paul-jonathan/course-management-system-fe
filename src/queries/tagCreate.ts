const tagCreate = `
  mutation CreateTags($tag: TagCreateInput!) {
    tagCreate(tag: $tag) {
      tag {
        id
        name
      }

      errors {
        code
        location
        message
      }
    }
  }
`;

export default tagCreate;
