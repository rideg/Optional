const Optional = require('../optional.js');


describe('optional', () => {
   
   describe('Optional.of', () => {
     it('creates absent from null', () => {
       expect(Optional.of(null)).toEqual(Optional.absent());
     });

     it('creates absent from indefined', () => {
       expect(Optional.of(undefined)).toEqual(Optional.absent());
     });
   });

   describe('get', () => {
      it('returns the value if present', () => {
        expect(Optional.of('value').get()).toBe('value');
      });
      
      it('throws exception if value is absent', () => {
        expect(() => Optional.absent().get()).toThrow(new Error('Value is absent'));
      });
   });

  describe('isPresent', () => {
     it('returns true if there is a value', () => {
       expect(Optional.of('value').isPresent()).toBe(true);
     });

     it('returns false if value is absent', () => {
       expect(Optional.absent().isPresent()).toBe(false);
     });
  });

  describe('isAbsent', () => {
     it('returns false if there is a value', () => {
       expect(Optional.of('value').isAbsent()).toBe(false);
     });

     it('returns true if value is absent', () => {
       expect(Optional.absent().isAbsent()).toBe(true);
     });
  });

  describe('ifPresent', () => {
    it('executes the given function if value presents', (done) => {
       Optional.of('value').ifPresent((value) => {
         expect(value).toBe('value');
         done();
       });
    });

    it('skips function if value is absent', () => {
      Optional.absent().ifPresent(() => fail('Should have skipeed'));
    });
  });

  describe('orElse', () => {
     it('returns value if present', () => {
       expect(Optional.of('value').orElse('other')).toBe('value');
     });

     it('returns default is absent', () => {
       expect(Optional.absent().orElse('default')).toBe('default');
     });
  });

  describe('map', () => {
     it('maps if value is present', () => {
       expect(Optional.of('value')
         .map((value) => value.toUpperCase()).get()).toBe('VALUE');
     });

     it('maps to absent', () => {
       expect(Optional.absent().map((value) => 'mapped').isPresent()).toBe(false);
     });
  });

  describe('toString', () => {
     it('prints value if present', () => {
       expect(Optional.of('value').toString()).toBe('Optional[\'value\']');
     });

     it('prints absetn if absent', () => {
       expect(Optional.absent().toString()).toBe('Optional[absent]');
     });
  });

  describe('promise', () => {
     it('resolves if value is present', (done) => {
       Optional.of('value').promise().then((value) => {
         expect(value).toBe('value');
         done();
       });
     });

     it('rejects if value is absent', (done) => {
       Optional.absent().promise().then(
         (value) => fail('Shouldni\'t have happened!'), 
         () => done());
     });
  });
});
