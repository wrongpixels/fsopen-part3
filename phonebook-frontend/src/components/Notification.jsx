const Notification = ({notification}) =>{
    if (!notification.message)
    {
        return;
    }
    const notificationStyle = {
        color: notification.isError?'red':'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        margin: 10
    };
    return (
        <div style={notificationStyle}>
            {notification.message}
        </div>
    )
}
export default Notification;