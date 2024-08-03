const Notification = ({notification}) => {

    

    return (
        <>
            {notification.message ? (
                <div className={`${notification.type}`}>
                    {notification.message}
                </div>
                ) : null
            }
        </>
    )
}

export default Notification