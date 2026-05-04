import UserItem from "../userItem/UserItem";
import Card from "../UIElements/Card";
import "./UserList.css";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem
          key={user._id}
          id={user._id}
          name={user.name}
          quizCount={user.quiz.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
