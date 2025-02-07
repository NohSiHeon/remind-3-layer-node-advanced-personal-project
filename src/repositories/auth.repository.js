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

	createSocialUser = async (email, name) => {
		const user = await this.prisma.user.create({
			data: {
				email,
				name,
				provider: 'NAVER'
			}
		});
		return user;
	}
	findRefreshTokenByUserId = async (userId) => {
		const refreshToken = await this.prisma.refreshToken.findUnique({
			where: {
				userId
			}
		});

		return refreshToken;
	}

	createRefreshToken = async (userId, refreshToken) => {
		await this.prisma.refreshToken.create({
			data: {
				userId,
				refreshToken
			}
		});
	}

	logOut = async (userId) => {
		return await this.prisma.refreshToken.delete({
			where: {
				userId
			}
		});
	}
}

export { AuthRepository };