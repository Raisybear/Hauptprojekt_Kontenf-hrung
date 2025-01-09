using Moq;
using System.Transactions;

namespace Unittests_SmartFlow
{
    [TestClass]
    public class UnitTest1
    {
        private Mock<IMongoCollection<User>> _mockUserCollection;
        private Mock<IMongoCollection<Konto>> _mockKontoCollection;
        private Mock<IMongoCollection<Transaktion>> _mockTransactionCollection;
        private Mock<IMongoClient> _mockMongoClient;
        private Mock<IKontoRepository> _mockKontoRepository;

        [TestMethod]
        public void TestMethod1()
        {

        }
    }
}