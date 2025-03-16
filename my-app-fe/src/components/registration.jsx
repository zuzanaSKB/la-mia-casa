function Registration() {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div
        className="registration-box p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "15px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 className="text-center mb-4 text-white">Registrácia</h1>
        <form className="d-flex flex-column gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Meno"
            required
          />
          <input
            type="text"
            className="form-control"
            placeholder="Priezvisko"
            required
          />
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            required
          />
          <input
            type="tel"
            className="form-control"
            placeholder="Telefón"
            required
          />
          <input type="date" className="form-control" required />
          <input
            type="password"
            className="form-control"
            placeholder="Heslo"
            required
          />
          <button type="submit" className="btn btn-success w-100">
            Registrovať sa
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
