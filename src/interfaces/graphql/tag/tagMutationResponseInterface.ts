import ErrorInterface from "../common/errorInterface";
import TagInterface from "./tagInterface";

interface TagMutationResponseInterface {
  tag: TagInterface;
  errors: [ErrorInterface];
};

export default TagMutationResponseInterface;

