const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      <label>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={handleUsernameChange}
        />
      </label>
    </div>
    <div>
      <label>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={handlePasswordChange}
        />
      </label>
    </div>
    <button type="submit">login</button>
  </form>
)

export default LoginForm
