const {
    getAllLibros,
    createLibro,
    updateLibro,
    deleteLibro,
    getLibroById,
} = require("../../src/controllers/libroController");

const libroModel = require("../../src/models/libroModel");

jest.mock("../../src/models/libroModel");

describe("Libro Controller", () => {
    let mockRes;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test("getLibros deberia obtener todos los libros", async () => {
        const mockLibros = [
            { id:"1", title:"Libro 1" },
            { id:"2", title:"Libro 2" },
        ];

        libroModel.find.mockResolvedValue(mockLibros);

        const mockReq = {};

        await getAllLibros(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCallWith(200);
        expect(mockRes.json).toHaveBeenCallWith(mockLibros);
    });

    test("getLibrosById deberia obtener un libro", async () => {
        const mockLibro = { id:"1", titulo:"Libro encontrado", autor:"Juan perez"};

        libroModel.findById.mockResolvedValue(mockLibro);

        const mockReq = { params: { id: "1" } };

        await getLibroById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCallWith(200);
        expect(mockRes.json).toHaveBeenCallWith(mockLibro);
    });

    test("createLibro deberia crear un nuevo libro", async () => {
        const mockLibro = { id:"1", titulo:"Nuevo Libro", autor:"Juan Perez"};

        libroModel.create.mockResolvedValue(mockLibro);

        const mockReq = { body: mockLibro};

        await createLibro(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCallWith(201);
        expect(mockRes.json).toHaveBeenCallWith(mockLibro);
    });

    test("updateLibro deberia actualizar un libro existente", async () => {
        const libroId = "1";
        const libroActualizado = { titulo:"Libro Actualizado", autor:"Autor Actualizado"};
        const libroActualizadoMock = { id: libroId, ...libroActualizado };

        libroModel.findByIdAndUpdate.mockResolvedValue(libroActualizadoMock);

        const mockReq = { params: { id:"1" }, body: libroActualizado };

        await updateLibro(mockReq, mockRes);

        expect(libroModel.findByIdAndUpdate).toHaveBeenCallWith(libroId, libroActualizado, { new: true });
        expect(mockRes.status).toHaveBeenCallWith(200);
        expect(mockRes.json).toHaveBeenCallWith(libroActualizadoMock);
    });

    test("updateLibro deberia devolver un error si el libro no existe", async () => {
        
        libroModel.findByIdAndUpdate.mockResolvedValue(null);

        const mockReq = { params: { id:"99" }, body: { titulo: "libro Actualizado" } };

        await updateLibro(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCallWith(404);
        expect(mockRes.json).toHaveBeenCallWith({ error: "Libro no encontrado"});
    });

    test("deleteLibro deberia eliminar un libro existente", async () => {
        const mockLibroEliminado = { titulo:"Libro Eliminado", autor:"autor Eliminado" };
        
        libroModel.findByIdAndRemove.mockResolvedValue(mockLibroEliminado);

        const mockReq = { params: { id:"1" } };

        await deleteLibro(mockReq, mockRes);
        expect(libroModel.findByIdAndRemove).toHaveBeenCallWith(mockReq.params.id);
        expect(mockRes.status).toHaveBeenCallWith(200);
        expect(mockRes.json).toHaveBeenCallWith(mockLibroEliminado);
    });

});