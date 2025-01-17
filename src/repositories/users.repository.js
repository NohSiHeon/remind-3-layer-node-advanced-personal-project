class UserRepository {
	constructor(prisma) {
		this.prisma = prisma;
	}

	profile = async (userId, profileImageUrl) => {
		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				profile: profileImageUrl
			}
		});

		return profileImageUrl;
	}
}

export { UserRepository };