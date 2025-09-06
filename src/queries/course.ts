const course = `
  query FetchCourse($id: ID!) {
    course(id: $id) {
      id
      name
      description
      created_at
      updated_at
      live
      chapter_order
      tags {
        id
        name
        description
      }
    }
  }
`;

export default course;
