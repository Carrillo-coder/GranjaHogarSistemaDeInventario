const UsuarioService = require('../../Services/usuarios.service');
const bcrypt = require('bcrypt');

jest.mock('../../Models', () => ({
    Usuario: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    },
    Rol: {
        findByPk: jest.fn()
    },
    Sequelize: { 
        Op: {
            ne: Symbol('ne')
        }
    }
}));
jest.mock('bcrypt');

const db = require('../../Models');

describe("UsuarioService Unit Tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllUsuarios", () => {
        test('Debe devolver todos los usuarios activos correctamente', async () => {
            const mockUsuarios = [{ id: 1, nombreCompleto: 'Juan Perez', activo: true }];
            db.Usuario.findAll.mockResolvedValue(mockUsuarios);

            const result = await UsuarioService.getAllUsuarios();

            expect(result.success).toBe(true);
            expect(result.statusCode).toBe(200);
            expect(result.data).toEqual(mockUsuarios);
            expect(db.Usuario.findAll).toHaveBeenCalledWith({
                where: { activo: true },
                include: expect.any(Array),
                order: expect.any(Array)
            });
        });

        test('Debe devolver 204 si no se encuentran usuarios', async () => {
            db.Usuario.findAll.mockResolvedValue([]);

            const result = await UsuarioService.getAllUsuarios();

            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(204);
        });
    });

    describe("getUsuarioById", () => {
        test('Debe devolver un usuario por su ID', async () => {
            const mockUsuario = { idUsuario: 1, nombreCompleto: 'Ana Gomez' };
            db.Usuario.findByPk.mockResolvedValue(mockUsuario);

            const result = await UsuarioService.getUsuarioById(1);

            expect(result.success).toBe(true);
            expect(result.statusCode).toBe(200);
            expect(result.data).toEqual(mockUsuario);
            expect(db.Usuario.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
        });

        test('Debe devolver 204 si el usuario no se encuentra', async () => {
            db.Usuario.findByPk.mockResolvedValue(null);

            const result = await UsuarioService.getUsuarioById(99);

            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(204);
        });
    });

    describe("createUsuario", () => {
        const userData = {
            nombreUsuario: 'testuser',
            nombreCompleto: 'Test User',
            password: 'password123',
            idRol: 1
        };

        test('Debe crear un usuario exitosamente', async () => {
            const hashedPassword = 'hashedpassword';
            const createdUser = { ...userData, idUsuario: 1, password: hashedPassword };

            db.Rol.findByPk.mockResolvedValue({ idRol: 1, nombre: 'Admin' }); 
            db.Usuario.findOne.mockResolvedValue(null); 
            bcrypt.hash.mockResolvedValue(hashedPassword); 
            db.Usuario.create.mockResolvedValue({ idUsuario: 1 });
            db.Usuario.findByPk.mockResolvedValue(createdUser);  

            const result = await UsuarioService.createUsuario(userData);

            expect(result.success).toBe(true);
            expect(result.statusCode).toBe(201);
            expect(result.data).toEqual(createdUser);
            expect(db.Rol.findByPk).toHaveBeenCalledWith(1);
            expect(db.Usuario.findOne).toHaveBeenCalledWith({ where: { nombreUsuario: 'testuser' } });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(db.Usuario.create).toHaveBeenCalled();
        });

        test('Debe fallar si el rol no existe', async () => {
            db.Rol.findByPk.mockResolvedValue(null); 

            const result = await UsuarioService.createUsuario(userData);

            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(400);
            expect(result.message).toBe('El rol especificado no existe');
        });

        test('Debe fallar si el nombre de usuario ya está en uso', async () => {
            db.Rol.findByPk.mockResolvedValue({ idRol: 1, nombre: 'Admin' });
            db.Usuario.findOne.mockResolvedValue({ idUsuario: 2, nombreUsuario: 'testuser' }); 

            const result = await UsuarioService.createUsuario(userData);

            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(400);
            expect(result.message).toBe('El nombre de usuario ya está en uso');
        });
    });

    describe("updateUsuario", () => {
         const updateData = {
            nombreUsuario: 'updateduser',
            nombreCompleto: 'Updated User',
            idRol: 2
        };
        const existingUser = { idUsuario: 1, nombreUsuario: 'olduser', password: 'oldhashedpassword', dataValues: { idUsuario: 1, nombreUsuario: 'olduser' } };

        test('Debe actualizar un usuario exitosamente sin cambiar la contraseña', async () => {
            const updatedUserWithRole = { ...updateData, idUsuario: 1 };

            db.Usuario.findByPk.mockResolvedValueOnce(existingUser);
            db.Rol.findByPk.mockResolvedValue({ idRol: 2 });
            db.Usuario.findOne.mockResolvedValue(null);
            db.Usuario.update.mockResolvedValue([1]);
            db.Usuario.findByPk.mockResolvedValueOnce(updatedUserWithRole);

            const result = await UsuarioService.updateUsuario(1, updateData);

            expect(result.success).toBe(true);
            expect(result.statusCode).toBe(200);
            expect(result.data).toEqual(updatedUserWithRole);
            expect(bcrypt.hash).not.toHaveBeenCalled();

            expect(db.Usuario.update).toHaveBeenCalled();

            const updateCallPayload = db.Usuario.update.mock.calls[0][0];

            expect(updateCallPayload.password).toBeUndefined();

            expect(updateCallPayload.nombreUsuario).toBe(updateData.nombreUsuario);
            expect(updateCallPayload.nombreCompleto).toBe(updateData.nombreCompleto);
        });
        
        test('Debe actualizar un usuario y su contraseña', async () => {
            const dataWithPass = { ...updateData, password: 'newpassword123' };
            const newHashedPassword = 'newhashedpassword';

            db.Usuario.findByPk.mockResolvedValueOnce(existingUser);
            db.Rol.findByPk.mockResolvedValue({ idRol: 2 });
            db.Usuario.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue(newHashedPassword);
            db.Usuario.update.mockResolvedValue([1]);
            db.Usuario.findByPk.mockResolvedValueOnce({ ...dataWithPass, idUsuario: 1 });

            await UsuarioService.updateUsuario(1, dataWithPass);

            expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
            expect(db.Usuario.update).toHaveBeenCalledWith(expect.objectContaining({
                password: newHashedPassword
            }), expect.any(Object));
        });
    });

    describe("deleteUsuario", () => {
        test('Debe desactivar un usuario (soft delete)', async () => {
            const mockUsuario = { idUsuario: 1, nombreCompleto: 'User to delete' };
            db.Usuario.findByPk.mockResolvedValue(mockUsuario);
            db.Usuario.update.mockResolvedValue([1]);

            const result = await UsuarioService.deleteUsuario(1);

            expect(result.success).toBe(true);
            expect(result.statusCode).toBe(200);
            expect(result.message).toBe('Usuario desactivado correctamente');
            expect(db.Usuario.update).toHaveBeenCalledWith(
                { activo: false },
                { where: { idUsuario: 1 } }
            );
        });

        test('Debe devolver 204 si el usuario a eliminar no existe', async () => {
            db.Usuario.findByPk.mockResolvedValue(null);

            const result = await UsuarioService.deleteUsuario(99);

            expect(result.success).toBe(false);
            expect(result.statusCode).toBe(204);
            expect(db.Usuario.update).not.toHaveBeenCalled();
        });
    });
});