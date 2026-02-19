const { init } = require('../index.js')

try {
    const client = init(480)
    const friends = client.friends

    console.log('Testing Friends API...')

    // Test FriendFlags existence
    if (!friends.FriendFlags) {
        throw new Error('FriendFlags is missing')
    }
    console.log('✓ FriendFlags found')


    // Test PersonaState existence
    if (!friends.PersonaState) {
        throw new Error('PersonaState is missing')
    }
    console.log('✓ PersonaState found')

    // Test getFriends
    const friendList = friends.getFriends(friends.FriendFlags.Immediate)
    console.log(`✓ getFriends returned ${friendList.length} friends`)

    if (friendList.length > 0) {
        const firstFriend = friendList[0]

        // Test Friend object structure
        if (typeof firstFriend.steamId !== 'bigint' || typeof firstFriend.name !== 'string') {
            throw new Error('Invalid Friend object structure')
        }

        if (typeof firstFriend.state !== 'number') {
            throw new Error('New Friend object property (state) is invalid or missing')
        }

        // nickname is optional
        if (firstFriend.nickname !== undefined && firstFriend.nickname !== null) {
            if (typeof firstFriend.nickname !== 'string') {
                throw new Error('Invalid nickname type')
            }
            console.log(`✓ Friend has a nickname: ${firstFriend.nickname}`)
        }

        // gamePlayed is optional
        if (firstFriend.gamePlayed !== undefined && firstFriend.gamePlayed !== null) {
            if (typeof firstFriend.gamePlayed.gameId !== 'bigint' || typeof firstFriend.gamePlayed.gameIp !== 'string') {
                throw new Error('Invalid FriendGameInfo structure in gamePlayed')
            }
            console.log('✓ Friend is in-game, gamePlayed structure is valid')
        }

        console.log('✓ Friend object structure is valid')

        // Test getFriendName
        const name = friends.getFriendName(firstFriend.steamId)
        if (name !== firstFriend.name) {
            throw new Error(`Name mismatch: expected ${firstFriend.name}, got ${name}`)
        }
        console.log(`✓ getFriendName returned correct name: ${name}`)
    } else {
        console.log('! No friends found to test individual properties, but getFriends call succeeded.')
    }

    console.log('All tests passed successfully!')
    process.exit(0)
} catch (err) {
    console.error('Test failed:', err)
    process.exit(1)
}
