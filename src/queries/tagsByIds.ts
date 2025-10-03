const tagsByIds = `
  query tagsByIds($page: Int, $per: Int, $ids: [Int!]!) {
    tagsByIds(page: $page, per: $per, ids: $ids) {
      tags {
        id
        name
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

export default tagsByIds;
