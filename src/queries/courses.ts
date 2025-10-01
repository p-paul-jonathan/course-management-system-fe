const courses = `
  query Courses($page: Int, $per: Int, $searchTerm: String, $userIds: [Int], $tagIds: [Int]) {
    courses(page: $page, per: $per, searchTerm: $searchTerm, userIds: $userIds, tagIds: $tagIds) {
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

export default courses;
