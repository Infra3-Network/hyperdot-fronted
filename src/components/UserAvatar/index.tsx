import { Avatar } from 'antd';
type Props = {
  size: number;
  username?: string;
  icon_url?: string;
};

function UserAvatar(props: Props) {
  if (props.icon_url) {
    return <Avatar size={props.size} src={'/apis/v1/file?file=' + props.icon_url} />;
  }

  return <Avatar size={props.size}>{props.username ? props.username : 'User'}</Avatar>;
}

export default UserAvatar;
