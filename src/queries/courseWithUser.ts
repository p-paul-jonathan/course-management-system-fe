const courseWithUser = `
  query FetchCourse($id: ID!) {
    course(id: $id) {
      id
      name
      description
      created_at
      updated_at
      live
      user {
        id
        first_name
        last_name
        email
        created_at
        updated_at
      }
      chapter_order
      tags {
        id
        name
      }
    }
  }
`;

export default courseWithUser;
