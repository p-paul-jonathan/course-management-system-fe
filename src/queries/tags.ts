const tags = `
  query fetchTags($page: Int, $per: Int, $searchTerm: String) {
    tags(page: $page, per: $per, searchTerm: $searchTerm) {
      tags {
        id
        name
        description
      }
      pageInfo {
        page
        per
        totalPages
        totalRecords
      }
    }
  }
`;

export default tags;
