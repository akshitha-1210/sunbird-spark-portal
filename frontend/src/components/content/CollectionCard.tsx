import { FiStar } from "react-icons/fi";
import { Badge } from "@/components/common/Badge";
import { Link } from "react-router-dom";
import { ContentSearchItem } from "@/types/workspaceTypes";
import ContentThumbnailPlaceholder from "@/components/common/ContentThumbnailPlaceholder";

interface ContentCardProps {
  item: ContentSearchItem;
}

const CollectionCard = ({ item }: ContentCardProps) => {
  return (
    <Link to={`/collection/${item.identifier}`} className="related-resource-card-link">
      <div className="group related-resource-card-container">
        {/* Image with padding */}
        <div className="related-resource-card-image-wrapper">
          <div className="related-resource-card-image-inner">
            {item.appIcon ? (
              <img
                src={item.appIcon}
                alt={item.name}
                className="resource-card-image"
              />
            ) : (
              <ContentThumbnailPlaceholder
                title={item.name || "Untitled"}
                className="resource-card-image"
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="related-resource-card-content-wrapper">
          {/* Badge below image */}
          <div
            className={`related-resource-card-badge`}
          >
            {item.primaryCategory || 'Collection'}
          </div>

          {/* Title */}
          <h3 className="related-resource-card-title">
            {item.name || 'Untitled'}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;