import "./admin.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";

import { Modal } from 'bootstrap';

import PasswordChecklist from "react-password-checklist";

import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";

import InputMask from "react-input-mask";

import axios from "axios";

export default function Admin() {
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [cpfInput, setCpfInput] = useState("");
  const [cargoInput, setCargoInput] = useState("");
  const [setShowCargoModal] = useState(false);
  const [newcargoInput, setnewcargoInput] = useState("");
  const [cargo, setCargo] = useState([]);
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3333/listUsers")
      .then(response => setData(response.data))
      .catch(error => console.log(error));
  }, []);


  function generateRandom4DigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  const userId = generateRandom4DigitNumber();


  async function handleRegister(e) {
    e.preventDefault();
  
    if (
      nameInput === "" ||
      emailInput === "" ||
      cpfInput === "" ||
      cargoInput === "" ||
      password === "" ||
      passwordAgain === ""
    ) {
      toast.warn("Preencha todos os campos!");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3333/createuser", {
        profile_id: userId,
        name: nameInput,
        email: emailInput,
        cpf: cpfInput,
        cargo: cargoInput,
        password: passwordAgain,
        status: "Ativo",
      });
  
      if (response.status === 200) {
        setNameInput("");
        setEmailInput("");
        setCpfInput("");
        setCargoInput("");
        setPassword("");
        setPasswordAgain("");
        toast.success("Cadastrado com Sucesso!");
  
      const response = await axios.get("http://localhost:3333/listUsers");
      setData(response.data);
        
      } else {
        toast.error("Ops erro ao cadastrar Funcionário");
      }
    } catch (error) {
      console.error("ERRO AO REGISTRAR", error);
      toast.error("Ops erro ao cadastrar Funcionário");
    }
  }


  async function handleRegisterCargo(e) {
    e.preventDefault();
  
    if (newcargoInput === "") {
      toast.warn("Preencha todos os campos!");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3333/createcargo", {
        cargo: newcargoInput
      });
  
      if (response.status === 200) {
        setnewcargoInput("");
        toast.success("Cargo Cadastrado com Sucesso!");
  
        setShowCargoModal(false);
  
        const modal = new Modal(document.getElementById("modaledit"));
        modal.show();
  
        setEditingUserId(null);
        setUserData({
          name: "",
          email: "",
          cpf: "",
          cargo: "",
          password: "",
          passwordAgain: ""
        });
  
        document.getElementById("nameInput").focus();
      } else {
        toast.error("Ops, erro ao cadastrar cargo");
      }
    } catch (error) {
      console.error("ERRO AO REGISTRAR CARGO", error);
      toast.error("Ops, erro ao salvar o cargo");
    }
  }
  

  async function handleDeleteUser(id) {
    try {
      await axios.delete(`http://localhost:3333/delete/${id}`);
      toast.error("Usuário excluído!");
  
      const response = await axios.get("http://localhost:3333/listUsers");
      setData(response.data);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário");
    }
  }  

  async function handleInativeUser(_id) {
    try {
      const response = await axios.put(`http://localhost:3333/updateuser/${_id}`, { status: "Inativo" });
  
      if (response.status === 200) {
        toast.warn("Usuário Inativado!");

      const response = await axios.get("http://localhost:3333/listUsers");
      setData(response.data);

      } else {
        toast.error("Erro ao inativar usuário");
      }
    } catch (error) {
      console.error("Erro ao inativar usuário:", error);
      toast.error("Erro ao inativar usuário");
    }
  }
  


  async function handleActiveUser(_id) {
    try {
      const response = await axios.put(`http://localhost:3333/updateuser/${_id}`, { status: "Ativo" });
  
      if (response.status === 200) {
        toast.success("Usuário Ativado!");

      const response = await axios.get("http://localhost:3333/listUsers");
      setData(response.data);
      
      } else {
        toast.error("Erro ao ativar usuário");
      }
    } catch (error) {
      console.error("Erro ao ativar usuário:", error);
      toast.error("Erro ao ativar usuário");
    }
  }


  const [userData, setUserData] = useState({
    name: "",
    email: "",
    cpf: "",
    cargo: ""
  });
  
  useEffect(() => {
    async function fetchCargos() {
      try {
        const response = await axios.get("http://localhost:3333/listcargos");
        setCargo(response.data);
      } catch (error) {
        console.error('Erro ao obter lista de cargos', error);
      }
    }
  
    fetchCargos();
  }, []);  


  const [editingUserId, setEditingUserId] = useState(null);

  const handleEditUser = (user) => {
    setEditingUserId(user._id);
    setUserData({
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      cargo: user.cargo
    });
  };

  async function handleUpdateUser(editingUserId) {
    try {
      await axios.put(`http://localhost:3333/updateuser/${editingUserId}`, {
        name: userData.name,
        email: userData.email,
        cpf: userData.cpf,
        cargo: userData.cargo
      });
      toast.success("Usuário atualizado com sucesso!");
  
      const updatedUserData = {
        name: userData.name,
        email: userData.email,
        cpf: userData.cpf,
        cargo: userData.cargo
      };

      setData(data.map(user => user._id === editingUserId ? { ...user, ...updatedUserData } : user));
  
      const modal = new Modal(document.getElementById("modaledit"));
      modal.hide();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar usuário");
    }
  }

  return (
    <div>
      <body class="bg-dark" id="size">
        <div class="container">
          <div class="row">
            <div class="container bg-light mt-5 rounded" id="size-box">
              <div class="row my-2">

                <div class="col-6">
                  <h3>Lista de Funcionários</h3>
                </div>

                <div class="col-6 d-flex justify-content-end">
                  <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Incluir</button>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-3 mb-2">
                  <input class="form-control mx-2"/>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-12">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nome</th>
                        <th scope="col">CPF</th>
                        <th scope="col">E-mail</th>
                        <th scope="col">Status</th>
                        <th scope="col">Cargo</th>
                        <th scope="col" id="acoes">Ações</th>
                      </tr>
                    </thead>

                    <tbody id="corpoFunc">
                      {data.map(item => (
                        <tr key={item._id}>
                          <th scope="row">{item.profile_id}</th>
                          <td>{item.name}</td>
                          <td>{item.cpf}</td>
                          <td>{item.email}</td>
                          <td>{item.status}</td>
                          <td>{item.cargo}</td>

                          {item.status === "Ativo" && (
                            <td id="acoes">
                              <button class="rounded me-1" onClick={() => handleEditUser(item)}>
                                <i class="bi bi-pencil" data-bs-toggle="modal" data-bs-target="#modaledit"></i>
                              </button>

                              <button class="rounded me-1" onClick={() => handleDeleteUser(item._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                </svg>
                              </button>

                              <button class="rounded me-1" onClick={() => handleInativeUser(item._id)}>
                                <i class="bi bi-x-square"></i>
                              </button>
                            </td>
                          )}

                          {item.status === "Inativo" && (
                            <td id="acoes">
                              <button class="rounded me-1">
                                <i class="bi bi-plus-square-fill" onClick={() => handleActiveUser(item._id)}></i>
                              </button>
                            </td>
                          )}

                        </tr>
                        ))}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Cadastro de Funcionários</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="container">
                  <form onSubmit={handleRegister}>
                    <div class="row">
                      <div class="col-sm-6">
                        <label class="form-label">Nome</label>
                        <input type="text" class="form-control" required value={nameInput} onChange={(e) => setNameInput(e.target.value)}/>
                      </div>

                      <div class="col-sm-6">
                        <label class="form-label">CPF</label>

                        <InputMask
                          mask="999.999.999-99"
                          type="text"
                          class="form-control"
                          required
                          value={cpfInput}
                          onChange={(e) => setCpfInput(e.target.value)}/>

                      </div>
                    </div>

                    <div class="row my-4 mb-2">
                      <div class="col-sm-6">
                        <label class="form-label">Email</label>
                        <input type="text" class="form-control" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
                      </div>

                      <div class="col-sm-6">
                        <label class="form-label">Cargo</label>

                        <div class="input-group mb-3">
                          <select class="form-select" id="inputGroupSelect02" value={cargoInput} onChange={(e) => setCargoInput(e.target.value)}>
                            <option selected></option>
                            {cargo.map((item, index) => (
                              <option key={index}>{item.cargo}</option>
                            ))}
                          </select>
                          <button class="btn btn-outline-secondary" type="button" id="button-addon2" data-bs-toggle="modal" data-bs-target="#cargoModal">Criar</button>
                        </div>
                      </div>
                    </div>

                    <div class="row mb-4">
                      <div class="col-sm-6">
                        <label class="form-label">Senha</label>
                        <input type="password" class="form-control" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                      </div>

                      <div class="col-sm-6">
                        <label class="form-label">Confirmar Senha</label>
                        <input type="password" class="form-control" required value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)}/>
                      </div>

                      <div class="row mb-2">
                        <div class="col-sm-6">

                          {password !== "" && (
                            <div class="mt-4">
                              <PasswordChecklist
                                rules={["specialChar", "number", "capital"]}
                                value={password}
                                valueAgain={passwordAgain}
                                messages={{
                                  specialChar:
                                    "A senha possui caracteres especiais",
                                  number: "A senha possui um número.",
                                  capital: "A senha possui letra maiúscula."
                                }}/>
                            </div>
                          )}

                        </div>
                        <div class="col-sm-6 position-absolute top-55 start-50">

                          {passwordAgain !== "" && (
                            <div class="mt-4">
                              <PasswordChecklist
                                rules={["match"]}
                                value={password}
                                valueAgain={passwordAgain}
                                messages={{
                                  match: "Senhas correspondem.",
                                }}/>
                            </div>
                          )}

                        </div>
                      </div>

                      <div class="col-sm-4"></div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-toggle="modal">Fechar</button>

                      {password !== passwordAgain && (
                        <but class="btn btn-primary">Salvar</but>
                      )}

                      {password === passwordAgain && (
                        <button type="submit" class="btn btn-primary" data-bs-toggle="modal" data-bs-dismiss="modal">Salvar</button>
                      )}

                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="cargoModal" tabindex="-1" aria-labelledby="cargoModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-sg">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="cargoModalLabel">Novo Cargo</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div class="modal-body">
                <div class="container">
                  <form onSubmit={handleRegisterCargo}>
                    <div class="row mb-4">
                      <div class="col-sm-6">
                        <label class="form-label">Nome do Cargo</label>
                        <input type="text" class="form-control" value={newcargoInput} onChange={(e) => setnewcargoInput(e.target.value)}/>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">Fechar</button>
                      <button type="submit" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Salvar</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="modaledit" tabindex="-1" aria-labelledby="modaleditLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="modaleditLabel">Editar Funcionário</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="container">
                  <form>
                    <div class="row">
                      <div class="col-sm-6">
                        <label class="form-label">Nome</label>
                        <input type="text" className="form-control" required value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })}/>
                      </div>

                      <div class="col-sm-6">
                        <label class="form-label">CPF</label>
                        <InputMask
                          mask="999.999.999-99"
                          type="text"
                          className="form-control"
                          required 
                          value={userData.cpf} onChange={(e) => setUserData({ ...userData, cpf: e.target.value })}
                        />
                      </div>
                    </div>

                    <div class="row my-4 mb-2">
                      <div class="col-sm-6">
                        <label class="form-label">Email</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        />
                      </div>

                      <div class="col-sm-6">
                        <label class="form-label">Cargo</label>

                        <div class="input-group mb-3">
                        <select
                          class="form-select"
                          id="inputGroupSelect02"
                          required
                          value={userData.cargo}
                          onChange={(e) => setUserData({ ...userData, cargo: e.target.value })}
                        >
                          <option selected></option>
                          {cargo.map((item, index) => (
                            <option key={index}>{item.cargo}</option>
                          ))}
                        </select>
                          <button class="btn btn-outline-secondary" type="button" id="button-addon2" data-bs-toggle="modal" data-bs-target="#cargoModal">Criar</button>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" onClick={() => handleUpdateUser(editingUserId)} data-bs-dismiss="modal">Salvar Alterações</button>                       
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="modaleditPassword" tabindex="-1" aria-labelledby="modaleditPassword" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="modaleditPassword">Alterar Senha</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="container">
                  <form>
                    <div class="row">
                      <div class="col-sm-6">
                        <label class="form-label">Senha Nova</label>
                        <input type="password" class="form-control" required/>
                      </div>

                      <div class="col-sm-6 mb-4">
                        <label class="form-label">Confirme Senha Nova</label>
                        <input type="password" class="form-control" required/>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                      <button type="submit" class="btn btn-primary">Salvar Senha</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </body>
    </div>
  )
}