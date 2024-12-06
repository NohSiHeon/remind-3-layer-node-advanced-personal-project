class AuthRepository {
	constructor(prisma) {
		this.prisma = prisma;
	}

	findUserByEmail = async (email) => {
		const user = await this.prisma.user.findUnique({
			where: {
				email
			}
		});

		return user;
	}

	findUserById = async (id) => {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			}
		});
		user.password = undefined;
		return user;
	}

	createUser = async (email, password, name) => {
		const user = await this.prisma.user.create({
			data: {
				email,
				password,
				name
			}
		});

		return user;
	}


}

export { AuthRepository };