import { cn } from "@/lib/utils";
import { getInitials, getGradientByTitle } from "@/lib/thumbnailUtils";

interface ContentThumbnailPlaceholderProps {
  title: string;
  className?: string;
}

const ContentThumbnailPlaceholder = ({
  title,
  className,
}: ContentThumbnailPlaceholderProps) => {
  const initials = getInitials(title);
  const gradient = getGradientByTitle(title);

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ background: gradient }}
      data-testid="content-thumbnail-placeholder"
      aria-hidden="true"
    >
      <span className="text-[2rem] font-semibold text-white select-none leading-none">
        {initials}
      </span>
    </div>
  );
};

export default ContentThumbnailPlaceholder;
