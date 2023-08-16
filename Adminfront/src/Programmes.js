import React from "react";

import { copyToStudent } from "./utils";
export class Programmes extends React.Component {
  state = { deletingId: null };
  delClick = (id) => {
    this.setState({ deletingId: id });
  };
  render() {
    const { deletingId } = this.state;
    const { programmes, prClick } = this.props;
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">action</th>
            <th scope="col">id</th>
            <th scope="col">Title</th>
            <th scope="col">Antal øvelser</th>
            <th scope="col">Billedid</th>
            <th scope="col">Store bogstaver</th>
            <th scope="col">Lydspørgsmål</th>
            <th scope="col">Beskrivelse</th>
            <th scope="col">Url</th>
          </tr>
        </thead>
        <tbody>
          {programmes.map((pr) => (
            <tr key={pr.id}>
              <th scope="row">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={prClick.bind(null, "edit", pr.id)}
                />{" "}
                <i className="fa fa-pencil" />
                {false && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={copyToStudent.bind(null, pr.id)}
                  >
                    <i className="fa fa-copy" />
                  </button>
                )}
                {deletingId === pr.id ? (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={prClick.bind(null, "del", pr.id)}
                  >
                    Slet
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      this.delClick(pr.id);
                    }}
                    className="btn btn-outline"
                  >
                    <i className="fa fa-trash-o" />
                  </button>
                )}
              </th>
              <td>{pr.id}</td>
              <td>{pr.title}</td>
              <td>{pr.exercises.length}</td>
              <td>{pr.pictureId}</td>
              <td>{"slet"}</td>
              <td>{pr.audioQuestion ? "Ja" : "Nej"}</td>
              <td>{pr.description}</td>
              <td>{pr.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
