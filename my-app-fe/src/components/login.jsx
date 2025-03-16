function Login() {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="login-box p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "15px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 className="text-center mb-4 text-white">Prihlásenie</h1>
        <form className="d-flex flex-column gap-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Heslo"
            required
          />
          <button type="submit" className="btn btn-success w-100">
            Prihlásiť sa
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
