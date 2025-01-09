using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SmartFlow_Backend.Controllers;
using SmartFlow_Backend.Models;
using SmartFlow_Backend.Repositories;
using SmartFlow_Backend.Tests;
using System.Threading.Tasks;
using MongoDB.Driver;
using System.Transactions;

namespace SmartFlow_Backend.Tests.Controllers
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public async Task CreateKontoAsync_CreatesKonto() // überprüfen ob neues Konto kerrekt erstellt wird.
        {
            // Arrange
            var mockRepository = new Mock<IKontoRepository>();
            var konto = new Konto
            {
                Id = "1",
                Name = "Testkonto",
                Geldbetrag = 1000,
                Zinssatz = 3.5
            };

            // Act
            await mockRepository.Object.CreateKontoAsync(konto);

            // Assert
            mockRepository.Verify(repo => repo.CreateKontoAsync(It.IsAny<Konto>()), Times.Once);
        }

        [TestMethod]
        public async Task GetKontoByIdAsync_ReturnsKonto_WhenKontoExists()  //Überprüfen, ob ein Konto korrekt anhand der ID zurückgegeben wird.
        {
            // Arrange
            var mockRepository = new Mock<IKontoRepository>();
            var konto = new Konto
            {
                Id = "1",
                Name = "Testkonto",
                Geldbetrag = 1000,
                Zinssatz = 3.5
            };

            mockRepository.Setup(repo => repo.GetKontoByIdAsync("1")).ReturnsAsync(konto);

            // Act
            var result = await mockRepository.Object.GetKontoByIdAsync("1");

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Testkonto", result.Name);
            Assert.AreEqual(1000, result.Geldbetrag);
        }

        [TestMethod]
        public async Task CreateUserAsync_CreatesUser()   // Überprüfen, ob der Benutzer korrekt erstellt wird.
        {
            // Arrange
            var mockRepository = new Mock<IUserRepository>();
            var user = new User
            {
                Username = "testuser",
                PasswordHash = "hashedpassword"
            };

            // Act
            await mockRepository.Object.CreateUserAsync(user);

            // Assert
            mockRepository.Verify(repo => repo.CreateUserAsync(It.IsAny<User>()), Times.Once);
        }

        [TestMethod]
        public async Task GetUserByUsernameAsync_ReturnsUser_WhenUserExists()  // Überprüfen, ob der Benutzer anhand des Benutzernamens korrekt gefunden wird.
        {
            // Arrange
            var mockRepository = new Mock<IUserRepository>();
            var user = new User
            {
                Username = "testuser",
                PasswordHash = "hashedpassword"
            };

            mockRepository.Setup(repo => repo.GetUserByUsernameAsync("testuser")).ReturnsAsync(user);

            // Act
            var result = await mockRepository.Object.GetUserByUsernameAsync("testuser");

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("testuser", result.Username);
        }

        [TestMethod]
        public async Task TransferAsync_PerformsTransferSuccessfully()  // Überprüfen, ob eine erfolgreiche Übertragung zwischen Konten durchgeführt wird.
        {
            // Arrange
            var mockKontoRepository = new Mock<IKontoRepository>();
            var transferDto = new TransaktionenDto
            {
                QuellkontoId = "1",
                ZielkontoId = "2",
                BenutzerId = "user1",
                Betrag = 100,
                Nachricht = "Überweisung"
            };

            var quellkonto = new Konto { Id = "1", Geldbetrag = 2000, BesitzerId = "user1" };
            var zielkonto = new Konto { Id = "2", Geldbetrag = 500, BesitzerId = "user1" };

            mockKontoRepository.Setup(repo => repo.GetKontoByIdAsync("1")).ReturnsAsync(quellkonto);
            mockKontoRepository.Setup(repo => repo.GetKontoByIdAsync("2")).ReturnsAsync(zielkonto);

            var transaktionsRepository = new TransaktionsRepository(mockKontoRepository.Object);

            // Act
            var result = await transaktionsRepository.TransferAsync(transferDto);

            // Assert
            Assert.IsTrue(result);
            Assert.AreEqual(1900, quellkonto.Geldbetrag);  
            Assert.AreEqual(600, zielkonto.Geldbetrag);  
        }

        [TestMethod]
        public async Task SpeichereTransaktionAsync_SavesTransaction() // Überprüfen, ob die Transaktion korrekt gespeichert wird.
        {
            // Arrange
            var mockMongoClient = new Mock<IMongoClient>();
            var mockConfiguration = new Mock<IConfiguration>();
            var mockDatabase = new Mock<IMongoDatabase>();
            var mockCollection = new Mock<IMongoCollection<Transaktion>>();

            // Simuliere die Rückgabe von GetDatabase und GetCollection
            mockMongoClient.Setup(client => client.GetDatabase(It.IsAny<string>(), It.IsAny<MongoDatabaseSettings>())).Returns(mockDatabase.Object);
            mockDatabase.Setup(db => db.GetCollection<Transaktion>(It.IsAny<string>(), It.IsAny<MongoCollectionSettings>())).Returns(mockCollection.Object);

            var transaction = new Transaktion
            {
                Id = "1",
                QuellkontoId = "1",
                ZielkontoId = "2",
                Betrag = 100,
                Nachricht = "Testtransaktion",
                Erstellungsdatum = DateTime.UtcNow
            };

            var transactionLogRepo = new TransactionsLogRepository(mockMongoClient.Object, mockConfiguration.Object);

            // Act
            await transactionLogRepo.SpeichereTransaktionAsync(transaction);

            // Assert
            mockMongoClient.Verify(client => client.GetDatabase(It.IsAny<string>(), It.IsAny<MongoDatabaseSettings>()), Times.Once);
            mockDatabase.Verify(db => db.GetCollection<Transaktion>(It.IsAny<string>(), It.IsAny<MongoCollectionSettings>()), Times.Once);
            mockCollection.Verify(col => col.InsertOneAsync(It.IsAny<Transaktion>(), null, default), Times.Once); // Überprüft, ob InsertOneAsync aufgerufen wurde
        }

        


    }
}
