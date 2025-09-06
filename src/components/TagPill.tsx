import TagInterface from "../interfaces/graphql/tag/tagInterface";

interface TagPillProps {
  tag: TagInterface;
}

function TagPill({ tag }: TagPillProps) {
  return (
    <div className="p-3 rounded-4xl bg-blue-600 text-white text-lg ml-2 mr-2" title={tag.description}>
      {tag.name}
    </div>
  );
};

export default TagPill;
