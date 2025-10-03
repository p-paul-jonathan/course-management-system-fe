const createdCourses = `
  query CreatedCourses($page: Int, $per: Int, $searchTerm: String, $tagIds: [Int]) {
    createdCourses(page: $page, per: $per, searchTerm: $searchTerm, tagIds: $tagIds) {
      courses {
        id
        name
        description
        created_at
        updated_at
        live
      }
      pageInfo {
        page
        per
        totalPages
        totalRecords
      }
    }
  }
`

export default createdCourses;
