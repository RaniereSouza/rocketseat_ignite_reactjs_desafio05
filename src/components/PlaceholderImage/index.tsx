import { AiOutlinePicture } from 'react-icons/ai';

import styles from './placeholderImg.module.scss';

interface PlaceholderImageProps {
  width?: string;
  height?: string;
}

export default function PlaceholderImage({ width = '100%', height = '100%' }: PlaceholderImageProps) {
  return (
    <div className={styles.placeholderImgContainer} style={{width, height}}>
      <AiOutlinePicture size={48} />
    </div>
  )
}
