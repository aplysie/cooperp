import {mock, instance, when, verify, anything, anyString} from 'ts-mockito';
import {CustomerRepository} from 'src/Infrastructure/Customer/Repository/CustomerRepository';
import {IsCustomerAlreadyExist} from 'src/Domain/Customer/Specification/IsCustomerAlreadyExist';
import {CustomerView} from 'src/Application/Customer/View/CustomerView';
import {Customer} from 'src/Domain/Customer/Customer.entity';
import {UpdateCustomerCommand} from './UpdateCustomerCommand';
import {CustomerNotFoundException} from 'src/Domain/Customer/Exception/CustomerNotFoundException';
import {CustomerAlreadyExistException} from 'src/Domain/Customer/Exception/CustomerAlreadyExistException';
import {UpdateCustomerCommandHandler} from './UpdateCustomerCommandHandler';

describe('UpdateCustomerCommandHandler', () => {
  let customerRepository: CustomerRepository;
  let isCustomerAlreadyExist: IsCustomerAlreadyExist;
  let updatedCustomer: Customer;
  let handler: UpdateCustomerCommandHandler;

  const command = new UpdateCustomerCommand();
  command.id = 'afda00b1-bf49-4102-9bc2-bce17f3acd48';
  command.name = 'Radio France';

  beforeEach(() => {
    customerRepository = mock(CustomerRepository);
    isCustomerAlreadyExist = mock(IsCustomerAlreadyExist);
    updatedCustomer = mock(Customer);

    handler = new UpdateCustomerCommandHandler(
      instance(customerRepository),
      instance(isCustomerAlreadyExist)
    );
  });

  it('testUpdateSuccessfully', async () => {
    when(
      customerRepository.findOneById('afda00b1-bf49-4102-9bc2-bce17f3acd48')
    ).thenResolve(instance(updatedCustomer));
    when(updatedCustomer.getId()).thenReturn(
      'afda00b1-bf49-4102-9bc2-bce17f3acd48'
    );
    when(updatedCustomer.getName()).thenReturn('RadioFrance');
    when(isCustomerAlreadyExist.isSatisfiedBy('Radio France')).thenResolve(
      false
    );
    expect(await handler.execute(command)).toMatchObject(
      new CustomerView('afda00b1-bf49-4102-9bc2-bce17f3acd48', anyString())
    );

    verify(isCustomerAlreadyExist.isSatisfiedBy('Radio France')).once();
    verify(customerRepository.save(instance(updatedCustomer))).once();
    verify(updatedCustomer.updateName('Radio France')).once();
    verify(updatedCustomer.updateName('Radio France')).calledBefore(
      customerRepository.save(instance(updatedCustomer))
    );
    verify(updatedCustomer.getId()).once();
    verify(updatedCustomer.getName()).twice();
  });

  it('testCustomerNotFound', async () => {
    when(
      customerRepository.findOneById('afda00b1-bf49-4102-9bc2-bce17f3acd48')
    ).thenResolve(null);

    try {
      await handler.execute(command);
    } catch (e) {
      expect(e).toBeInstanceOf(CustomerNotFoundException);
      expect(e.message).toBe('customer.errors.not_found');
      verify(isCustomerAlreadyExist.isSatisfiedBy(anything())).never();
      verify(customerRepository.save(anything())).never();
      verify(updatedCustomer.updateName(anything())).never();
      verify(updatedCustomer.getId()).never();
      verify(updatedCustomer.getName()).never();
    }
  });

  it('testCustomerAlreadyExist', async () => {
    when(
      customerRepository.findOneById('afda00b1-bf49-4102-9bc2-bce17f3acd48')
    ).thenResolve(instance(updatedCustomer));
    when(isCustomerAlreadyExist.isSatisfiedBy('Radio France')).thenResolve(
      true
    );

    try {
      await handler.execute(command);
    } catch (e) {
      expect(e).toBeInstanceOf(CustomerAlreadyExistException);
      expect(e.message).toBe('customer.errors.already_exist');
      verify(isCustomerAlreadyExist.isSatisfiedBy('Radio France')).once();
      verify(customerRepository.save(anything())).never();
      verify(updatedCustomer.updateName(anything())).never();
      verify(updatedCustomer.getId()).never();
      verify(updatedCustomer.getName()).once();
    }
  });
});
